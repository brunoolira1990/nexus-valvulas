from django.shortcuts import render

from apps.products.models import Product


def home(request):
  """
  Página inicial simples listando produtos ativos.
  """
  products = (
    Product.objects.filter(is_active=True)
    .select_related("category")
    .order_by("title")[:12]
  )
  context = {
    "products": products,
  }
  return render(request, "home.html", context)

