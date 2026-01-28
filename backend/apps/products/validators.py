from django.core.exceptions import ValidationError


def validate_product_size_relationship(size_obj):
    """
    Valida que ProductSize tem OU product OU variant, nunca ambos ou nenhum
    """
    if not size_obj.product and not size_obj.variant:
        raise ValidationError("Tamanho deve estar vinculado a um Produto OU a uma Variante")
    if size_obj.product and size_obj.variant:
        raise ValidationError("Tamanho não pode estar vinculado a Produto E Variante ao mesmo tempo")


