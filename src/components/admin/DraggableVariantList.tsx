import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface Variant {
  id: string;
  type: string;
  size: string;
  drawing_url?: string | null;
  position: number;
}

interface SortableVariantItemProps {
  variant: Variant;
  onDelete: (id: string) => void;
}

function SortableVariantItem({ variant, onDelete }: SortableVariantItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted/50' : ''}>
      <TableCell className="w-8">
        <Button
          variant="ghost"
          size="sm"
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>{variant.type}</TableCell>
      <TableCell>{variant.size}</TableCell>
      <TableCell>
        {variant.drawing_url ? (
          <img 
            src={variant.drawing_url} 
            alt={`${variant.type} ${variant.size}`} 
            className="h-10 object-contain" 
          />
        ) : (
          <span className="text-xs text-muted-foreground">Sem desenho</span>
        )}
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={() => onDelete(variant.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

interface DraggableVariantListProps {
  variants: Variant[];
  onReorder: (variants: Variant[]) => void;
  onDelete: (id: string) => void;
}

export function DraggableVariantList({ variants, onReorder, onDelete }: DraggableVariantListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = variants.findIndex((item) => item.id === active.id);
      const newIndex = variants.findIndex((item) => item.id === over?.id);

      const reorderedVariants = arrayMove(variants, oldIndex, newIndex);
      
      // Atualiza as posições baseado na nova ordem
      const updatedVariants = reorderedVariants.map((variant, index) => ({
        ...variant,
        position: index + 1,
      }));

      onReorder(updatedVariants);
    }
  }

  if (variants.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4">
        Nenhuma variante cadastrada.
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={variants} strategy={verticalListSortingStrategy}>
        {variants.map((variant) => (
          <SortableVariantItem
            key={variant.id}
            variant={variant}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}