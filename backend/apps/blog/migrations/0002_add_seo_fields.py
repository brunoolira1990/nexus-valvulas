# Generated manually for SEO fields and category

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='category',
            field=models.CharField(
                choices=[('Noticias', 'Notícias'), ('Tecnico', 'Técnico'), ('Eventos', 'Eventos'), ('Produtos', 'Produtos')],
                default='Noticias',
                max_length=20,
                verbose_name='Categoria'
            ),
        ),
        migrations.AddField(
            model_name='post',
            name='meta_title',
            field=models.CharField(
                blank=True,
                help_text='Título para SEO (máximo 60 caracteres recomendado)',
                max_length=70,
                verbose_name='Meta Title'
            ),
        ),
        migrations.AddField(
            model_name='post',
            name='meta_description',
            field=models.TextField(
                blank=True,
                help_text='Descrição para SEO (máximo 160 caracteres recomendado)',
                max_length=160,
                verbose_name='Meta Description'
            ),
        ),
        migrations.AddField(
            model_name='post',
            name='focus_keyword',
            field=models.CharField(
                blank=True,
                help_text='Palavra-chave principal para SEO (uso interno)',
                max_length=100,
                verbose_name='Palavra-chave Foco'
            ),
        ),
    ]
