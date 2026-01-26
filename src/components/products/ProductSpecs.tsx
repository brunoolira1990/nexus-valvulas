import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, FileText, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSpecsProps {
  specifications?: Record<string, string>;
  applications?: string[];
  standards?: string[];
  selectedVariant?: {
    type?: string;
    size?: string;
  };
  className?: string;
}

export function ProductSpecs({
  specifications,
  applications,
  standards,
  selectedVariant,
  className,
}: ProductSpecsProps) {
  const hasContent =
    (specifications && Object.keys(specifications).length > 0) ||
    (applications && applications.length > 0) ||
    (standards && standards.length > 0) ||
    selectedVariant;

  if (!hasContent) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Especificações Selecionadas */}
      {selectedVariant && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuração Selecionada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedVariant.type && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-muted-foreground">Material:</span>
                <span className="text-sm font-semibold">{selectedVariant.type}</span>
              </div>
            )}
            {selectedVariant.size && (
              <>
                {selectedVariant.type && <Separator />}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-muted-foreground">Tamanho:</span>
                  <span className="text-sm font-semibold">{selectedVariant.size}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Especificações Técnicas */}
      {specifications && Object.keys(specifications).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Especificações Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start py-2 border-b last:border-0">
                  <dt className="text-sm font-medium text-muted-foreground pr-4">
                    {key}:
                  </dt>
                  <dd className="text-sm font-semibold text-right flex-1">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Aplicações */}
      {applications && applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Aplicações Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {applications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{app}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Normas Técnicas */}
      {standards && standards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Normas Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {standards.map((standard, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {standard}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


