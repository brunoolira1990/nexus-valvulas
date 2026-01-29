# Migration: Category model + Post.author + Post.category as FK

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def create_categories_and_migrate(apps, schema_editor):
    Category = apps.get_model("blog", "Category")
    Post = apps.get_model("blog", "Post")

    old_to_new = [
        ("Noticias", "Notícias", "noticias"),
        ("Tecnico", "Técnico", "tecnico"),
        ("Eventos", "Eventos", "eventos"),
        ("Produtos", "Produtos", "produtos"),
    ]
    category_by_old = {}
    for old_val, name, slug in old_to_new:
        cat, _ = Category.objects.get_or_create(slug=slug, defaults={"name": name})
        category_by_old[old_val] = cat

    for post in Post.objects.all():
        old_cat = getattr(post, "category_old", None)
        if old_cat and old_cat in category_by_old:
            post.category_new = category_by_old[old_cat]
            post.save(update_fields=["category_new"])


def reverse_migrate(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("blog", "0003_ckeditor_seo_keywords"),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("slug", models.SlugField(blank=True, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name="post",
            name="author",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="category_new",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="blog.category",
            ),
        ),
        migrations.RenameField(
            model_name="post",
            old_name="category",
            new_name="category_old",
        ),
        migrations.RunPython(create_categories_and_migrate, reverse_migrate),
        migrations.RemoveField(
            model_name="post",
            name="category_old",
        ),
        migrations.RenameField(
            model_name="post",
            old_name="category_new",
            new_name="category",
        ),
        migrations.AlterField(
            model_name="post",
            name="cover_image",
            field=models.ImageField(blank=True, null=True, upload_to="blog_covers/"),
        ),
        migrations.AlterField(
            model_name="post",
            name="excerpt",
            field=models.TextField(blank=True, help_text="Breve resumo do post"),
        ),
    ]
