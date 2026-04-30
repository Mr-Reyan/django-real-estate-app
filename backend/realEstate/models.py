from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser
from django.db.models import Q
from django.db import models
from django.db.models import Avg


# Create your models here.
class User(AbstractUser):
    ROLE_ACCESS=(
        ("admin","Admin"),
        ("agent","Agent"),
        ("user","User"),
    )
    
    role = models.CharField(max_length=10,choices=ROLE_ACCESS,default="user")

    
class UserProfile(models.Model):
    name = models.CharField(max_length=200)
    age = models.PositiveIntegerField(null=True, blank=True)
    phone = models.CharField(max_length=20)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    address = models.CharField(max_length=225)
    slug = models.SlugField(unique=True,max_length=225, null=True,blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while Property.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)
    

class Property(models.Model):
    STATUS_CHOICES = [
    ("rent", "Rent"),
    ("sale", "Sale"),
]
    
    
    TYPE_CHOICES = [
    ("commercial", "Commercial"),
    ("residential", "Residential"),
    ("agricultural", "Agricultural"),
    ("industrial", "Industrial"),
    ]

    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="properties")
    title = models.CharField(max_length=225,blank=False)
    slug = models.SlugField(unique=True,max_length=225, null=True,blank=True)
    description = models.TextField()
    price = models.DecimalField(decimal_places=2,max_digits=12)
    prop_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="sale",
    )
    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default="commercial",
    )
    likes = models.ManyToManyField(User,related_name="liked_properties",blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="Pakistan")
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    updated_at = models.DateTimeField(auto_now=True,null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while Property.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.title}"



class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images"
        )
    image = models.ImageField(upload_to="properties/")
    is_primary = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_primary:
            PropertyImage.objects.filter(
                property=self.property,
                is_primary=True
            ).update(is_primary=False)
        super().save(*args, **kwargs)

class VisitRequests(models.Model):
    
    VISIT_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="visit_requests"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="visitor_requests"
    )

    name = models.CharField(max_length=225)
    phone = models.CharField(max_length=20)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=VISIT_CHOICES,
        default='pending'
    )

    def __str__(self):
        return f"{self.user.username} -> {self.property.title} ({self.status})"

class Review(models.Model):
    reviewer = models.ForeignKey(User,on_delete=models.CASCADE,related_name='given_reviews')
    agent = models.ForeignKey(User,on_delete=models.CASCADE,related_name='recieved_reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together= ('reviewer','agent')
        ordering= ['-created_at']

    @classmethod
    def get_avg_rating(cls,agent):
        result = cls.objects.filter(agent=agent).aggregate(avg=Avg('rating'))
        return result['avg'] or 0
