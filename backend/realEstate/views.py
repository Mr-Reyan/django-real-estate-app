from django.shortcuts import render, get_object_or_404
from django.http import  HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Property, PropertyImage, UserProfile, VisitRequests, Review
from django.utils.text import slugify
from .serializers import PropertySerializer, PropertyImageSerializer, RegisterSerializer,UserSerializer, ProfileSerializer, VisitReqSerializer,ReviewSerializer
from django.contrib.auth import get_user_model
from .permissions import IsAgent
from rest_framework.pagination import PageNumberPagination

User = get_user_model()


class PropertyPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 20



@api_view(['GET'])
def view_property(request):
    try:

        properties = Property.objects.all()
        paginator = PropertyPagination()
        paginated_qs = paginator.paginate_queryset(properties,request)
    
        serializer = PropertySerializer(paginated_qs,many=True)

        return paginator.get_paginated_response(serializer.data)
    
    except Exception as e:
        return Response(f"Error viewing Properties: {e}",status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAgent])
def create_property(request):
    try:
        data = request.data
        title = data.get("title")
        if not title or not data.get("price") or not data.get("prop_status"):
            return Response({"error": "Missing required fields"}, status=400)
        
        
        property = Property.objects.create(
            title=data.get("title"),
            price=data.get("price"),
            prop_status=data.get("prop_status"),  
            type=data.get("type"),
            description=data.get("description"),
            address=data.get("address"),
            city=data.get("city"),
            state=data.get("state"),
            country=data.get("country"),
            postal_code=data.get("postal_code"),
            owner=request.user
        )

        images = request.FILES.getlist("images")

        for index, img in enumerate(images):
            PropertyImage.objects.create(
                property=property,
                image=img,
                is_primary=(index==0)
            )

        serializer = PropertySerializer(property)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(f"Error creating Properties: {e}",status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAgent])
def delete_property(request):
    item_id = request.data.get("item_id")
    property = get_object_or_404(Property,id=item_id)

    if request.user != property.owner:
        return Response({"error": "Not allowed"}, status=403)
    
    property.delete()
    return Response({'message':'Item removed.'})


@api_view(['PUT'])
@permission_classes([IsAgent])
def update_property(request):

    item_id = request.data.get("item_id")
    title = request.data.get("title")
    price = request.data.get("price")
    status = request.data.get("status")
    if not title or not price:
        return Response({"Error":"Title and price must be present"},status=status.HTTP_400_BAD_REQUEST)
    try:
        property = Property.objects.get(id=item_id)
        property.title = title
        property.price = price
        property.prop_status = status
        property.save()
        serializer = PropertySerializer(property)
        return Response(serializer.data)
    except Exception as e:
        return Response({"Error":f"Error while updating: {e}"},status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data = request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message":"User created successfully.","user":UserSerializer(user).data},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=400)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):    
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request,id):
    user = request.user

    try:
        property = Property.objects.get(id=id)
    except Property.DoesNotExist:
        return Response({"error":"Property not found"},status=400)

    if property.likes.filter(id=user.id).exists():
        property.likes.remove(user)
        return Response({"message":"Unliked"},status=200)
    else:
        property.likes.add(user)
        return Response({"message":"Liked"},status=200)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_liked(request, id):
    prop = Property.objects.get(id=id)

    return Response({
        "liked": request.user in prop.likes.all()
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    profile, created = UserProfile.objects.get_or_create(owner=request.user)
    
    profile.name = request.data.get("name")
    profile.age = request.data.get("age")
    profile.phone = request.data.get("phone")
    profile.address = request.data.get("address")
    
    profile.save()
    serializer = ProfileSerializer(profile)
    return Response(serializer.data,status=201)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    try:
        profile = UserProfile.objects.get(owner=request.user)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)
    
    profile.name = request.data.get("name")
    profile.age = request.data.get("age")
    profile.phone = request.data.get("phone")
    profile.address = request.data.get("address")
    
    profile.save()
    serializer = ProfileSerializer(profile)
    return Response(serializer.data,status=200)
    
    

@api_view(['GET'])
def show_profile(request,prof_id):
    try:
        profile = UserProfile.objects.get(id=prof_id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({"Error":"Profile doesnt exist."},status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_request(request,property_id):
    property = get_object_or_404(Property,id=property_id)
    
    if(request.user==property.owner):
        return Response({"Error":"You cannot send visit request to yourself."},status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()
    data['user']=request.user.id
    data['property'] = property.id

    serializer = VisitReqSerializer(data = data,context={"request":request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_requests(request,property_id):
    property = get_object_or_404(Property,id=property_id)

    if request.user != property.owner:
        return Response(
            {"error": "Not allowed"},
            status=status.HTTP_403_FORBIDDEN
        )

    visit_reqs = VisitRequests.objects.filter(property=property)
    serializer = VisitReqSerializer(visit_reqs,many=True)
    return Response(serializer.data,status=200)
    

@api_view(['PATCH'])
def reject_request(request,req_id):
    visReq = get_object_or_404(VisitRequests,id=req_id)
    if request.user != visReq.property.owner:
        return Response({"Error":"not allowed"},status=status.HTTP_403_FORBIDDEN)
    if visReq.status == "completed":
        return Response(
            {"error": "Cannot reject a completed request"},
            status=400
        )

    visReq.status = "rejected"
    visReq.save()
    return Response({"message":"Visit Request Rejected!"},status=200)
    

@api_view(['PATCH'])
def approve_request(request,req_id):
    visReq = get_object_or_404(VisitRequests,id=req_id)

    if request.user != visReq.property.owner:
        return Response({"Error":"not allowed"},status=403)
    if visReq.status == "rejected":
        return Response(
            {"error": "Cannot complete a rejected request"},
            status=400
        )
    visReq.status = "approved"
    visReq.save()
    return Response({"message":"Visit request approved!"},status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    serializer = ReviewSerializer(
        data=request.data,
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save(reviewer=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_review(request,rev_id):
    review = get_object_or_404(Review,id=rev_id)
    if review.reviewer != request.user:
        return Response({"Error":"You cannot delete other's review"},status=403)
    review.delete()
    
    return Response({'message':'Review removed.'})