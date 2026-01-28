import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SEOEditorProps {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onFocusKeywordChange: (value: string) => void;
  className?: string;
}

export function SEOEditor({
  metaTitle,
  metaDescription,
  focusKeyword,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onFocusKeywordChange,
  className,
}: SEOEditorProps) {
  const [siteUrl] = useState(() => window.location.origin);
  const [siteName] = useState('Nexus Válvulas');

  const titleLength = metaTitle.length;
  const descriptionLength = metaDescription.length;

  const titleStatus = titleLength === 0 ? 'empty' : titleLength <= 60 ? 'good' : 'warning';
  const descriptionStatus = descriptionLength === 0 ? 'empty' : descriptionLength <= 160 ? 'good' : 'warning';

  const displayTitle = metaTitle || 'Título do Post';
  const displayDescription = metaDescription || 'Descrição do post aparecerá aqui...';
  const displayUrl = `${siteUrl}/blog/slug-do-post`;

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Otimização para Buscadores (SEO)</CardTitle>
          <CardDescription>
            Configure os metadados para melhorar o rankeamento no Google
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Focus Keyword */}
          <div className="space-y-2">
            <Label htmlFor="focus_keyword">Palavra-chave Foco</Label>
            <Input
              id="focus_keyword"
              value={focusKeyword}
              onChange={(e) => onFocusKeywordChange(e.target.value)}
              placeholder="Ex: válvulas industriais"
            />
            <p className="text-xs text-muted-foreground">
              Palavra-chave principal para SEO (uso interno)
            </p>
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meta_title">Meta Title</Label>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    titleStatus === 'good' && 'text-green-600',
                    titleStatus === 'warning' && 'text-red-600',
                    titleStatus === 'empty' && 'text-muted-foreground'
                  )}
                >
                  {titleLength}/60
                </span>
                {titleStatus === 'good' && titleLength > 0 && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                {titleStatus === 'warning' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            <Input
              id="meta_title"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder="Título otimizado para SEO (máximo 60 caracteres)"
              maxLength={70}
              className={cn(
                titleStatus === 'good' && titleLength > 0 && 'border-green-500',
                titleStatus === 'warning' && 'border-red-500'
              )}
            />
            <p className="text-xs text-muted-foreground">
              Título que aparecerá nos resultados de busca
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meta_description">Meta Description</Label>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    descriptionStatus === 'good' && 'text-green-600',
                    descriptionStatus === 'warning' && 'text-red-600',
                    descriptionStatus === 'empty' && 'text-muted-foreground'
                  )}
                >
                  {descriptionLength}/160
                </span>
                {descriptionStatus === 'good' && descriptionLength > 0 && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                {descriptionStatus === 'warning' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            <Textarea
              id="meta_description"
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder="Descrição otimizada para SEO (máximo 160 caracteres)"
              maxLength={160}
              rows={3}
              className={cn(
                descriptionStatus === 'good' && descriptionLength > 0 && 'border-green-500',
                descriptionStatus === 'warning' && 'border-red-500'
              )}
            />
            <p className="text-xs text-muted-foreground">
              Descrição que aparecerá nos resultados de busca
            </p>
          </div>

          {/* Google Snippet Preview */}
          <div className="space-y-2">
            <Label>Preview do Google</Label>
            <div className="border rounded-lg p-4 bg-background">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">{siteUrl}</span>
                </div>
                <h3
                  className={cn(
                    'text-lg text-blue-600 hover:underline cursor-pointer line-clamp-1',
                    !metaTitle && 'text-muted-foreground'
                  )}
                >
                  {displayTitle}
                </h3>
                <p
                  className={cn(
                    'text-sm text-gray-600 line-clamp-2',
                    !metaDescription && 'text-muted-foreground'
                  )}
                >
                  {displayDescription}
                </p>
                <p className="text-xs text-green-700">{displayUrl}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Visualização aproximada de como o post aparecerá nos resultados do Google
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
