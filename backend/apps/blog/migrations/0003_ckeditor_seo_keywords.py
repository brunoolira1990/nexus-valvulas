# Generated manually: CKEditor + SEO keywords

from django.db import migrations, models
import ckeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0002_add_seo_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="content",
            field=ckeditor.fields.RichTextField(verbose_name="Conteúdo"),
        ),
        migrations.AlterField(
            model_name="post",
            name="meta_description",
            field=models.CharField(
                blank=True,
                help_text="Resumo que aparece nos resultados de busca (até 160 caracteres).",
                max_length=160,
                verbose_name="Meta Description",
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="keywords",
            field=models.CharField(
                blank=True,
                help_text="Palavras-chave separadas por vírgula.",
                max_length=255,
                verbose_name="Palavras-chave",
            ),
        ),
    ]
