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
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 20


@api_view(['GET'])
def get_all_agents(request):
    try:
        agents = UserProfile.objects.filter(owner__role="agent")

        paginator = PageNumberPagination()

        result_page = paginator.paginate_queryset(agents, request)

        serializer = ProfileSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    except Exception as e:
        return Response({"error": str(e)}, status=400)



@api_view(['GET'])
def view_properties(request):
    try:

        properties = Property.objects.all()
        paginator = PropertyPagination()
        paginated_qs = paginator.paginate_queryset(properties,request)
    
        serializer = PropertySerializer(paginated_qs,many=True)

        return paginator.get_paginated_response(serializer.data)
    
    except Exception as e:
        return Response(f"Error viewing Properties: {e}",status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def profile_properties(request, prof_id):
    try:
        profile = UserProfile.objects.get(id=prof_id)  
        user = profile.owner  

        properties = Property.objects.filter(owner=user)  
        serializer = PropertySerializer(properties, many=True)
        print("PROFILE:", profile.id)
        print("USER:", user.id)
        print("FILTERED COUNT:", properties.count())    
        return Response(serializer.data)

    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)


@api_view(['GET'])
def property_detail(request,id):
    try:
        

        property = get_object_or_404(Property, id=id)
        serializer = PropertySerializer(property)
        return Response(serializer.data)
    
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
def delete_property(request,property_id):
    
    property = get_object_or_404(Property,id=property_id)

    if request.user != property.owner:
        return Response({"error": "Not allowed"}, status=403)
    
    property.delete()
    return Response({'message':'Item removed.'})


@api_view(['PATCH'])
@permission_classes([IsAgent])
def update_property(request,property_id):

    try:
        property_obj = Property.objects.get(id=property_id)
    except Property.DoesNotExist:
        return Response(
        {"error": "Property not found"},
        status=status.HTTP_404_NOT_FOUND
    )
    
    serializer = PropertySerializer(property_obj,data=request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors,status=400)

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
        print("unliked")
        return Response({"message":"Unliked"},status=200)
    else:
        property.likes.add(user)
        print("liked")
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
@permission_classes([IsAuthenticated])
def my_profile(request):
    try:
        
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    except UserProfile.DoesNotExist:
        return Response(
            {"detail": "Profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )

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

    exists = VisitRequests.objects.filter(
        user=request.user,
        property=property
    ).exclude(status__in=['completed', 'rejected']).exists()

    if exists:
        return Response(
            {"error": "You already have a pending visit request."},
            status=400
        )

    serializer = VisitReqSerializer(data = request.data,context={"request":request})
    if serializer.is_valid():
        serializer.save(
            user=request.user,
            property=property
        )
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAgent])
def get_requests(request):
    try:
        user = request.user
        # visit_reqs = VisitRequests.objects.all()
        visit_reqs = VisitRequests.objects.filter(property__owner=user)
        
        serializer = VisitReqSerializer(visit_reqs,many=True)
        return Response(serializer.data,status=200)
    except Exception as e:
        return Response({"Error":e},status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_sent_requests(request):
    try:
        user = request.user
        visit_reqs = VisitRequests.objects.filter(user=user)
        
        serializer = VisitReqSerializer(visit_reqs,many=True)
        return Response(serializer.data,status=200)
    except Exception as e:
        return Response({"Error":e},status=400)
    

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
            {"error": "Cannot approve a rejected request"},
            status=400
        )
    visReq.status = "approved"
    visReq.save()
    return Response({"message":"Visit request approved!"},status=200)

@api_view(['PATCH'])
def complete_request(request,req_id):

    visReq = get_object_or_404(VisitRequests,id=req_id)
    print(visReq.user)
    if request.user != visReq.user:
        return Response({"Error":"not allowed"},status=403)
    if visReq.status == "rejected":
        return Response(
            {"error": "Cannot complete a rejected request"},
            status=400
        )
    visReq.status = "completed"
    visReq.save()
    return Response({"message":"Visit request Completed!"},status=200)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request,agent_id):
    try:
        agent = UserProfile.objects.get(id=agent_id)
    except UserProfile.DoesNotExist:
        return Response({"error": "Agent not found"}, status=404)
    
    if Review.objects.filter(
        reviewer=request.user,
        agent=agent
    ).exists():
        return Response(
            {"Error": "Cannot review again!"},
            status=403
        )
    
    serializer = ReviewSerializer(
        data=request.data,
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save(reviewer=request.user,agent=agent)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_reviews(request, agent_id):
    try:
        agent = UserProfile.objects.get(id=agent_id)
        avg_rating = Review.get_avg_rating(agent)
        reviews = Review.objects.filter(
            agent=agent
        ).order_by('-created_at')

        serializer = ReviewSerializer(
            reviews,
            many=True
        )

        return Response({"reviews":serializer.data,"avg_rating":avg_rating})

    except UserProfile.DoesNotExist:
        return Response(
            {"error": "Profile not found"},
            status=404
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_review(request,rev_id):
    review = get_object_or_404(Review,id=rev_id)
    if review.reviewer != request.user:
        return Response({"Error":"You cannot delete other's review"},status=403)
    review.delete()
    
    return Response({'message':'Review removed.'})