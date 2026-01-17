"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DateTimePicker } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEvents } from "@/hooks/use-events";
import {
  type CreateEventInput,
  createEventSchema,
} from "@/lib/validations/event";

export function CreateEventForm() {
  const router = useRouter();
  const { isLoading, createEvent } = useEvents();

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      bannerUrl: "",
      category: "workshop",
      location: "",
      address: "",
      maxAttendees: 50,
      status: "draft",
    },
  });

  async function onSubmit(data: CreateEventInput) {
    const result = await createEvent(data as any);

    if (result.success && result.event) {
      router.push(`/painel/eventos/${result.event.id}`);
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Evento *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Workshop de Matemática Aplicada"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o evento, objetivos e público-alvo..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="palestra">Palestra</SelectItem>
                    <SelectItem value="seminario">Seminário</SelectItem>
                    <SelectItem value="formacao">Formação</SelectItem>
                    <SelectItem value="congresso">Congresso</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxAttendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Vagas *</FormLabel>
                <FormControl>
                  <Input
                    min={1}
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e Hora de Início *</FormLabel>
                <FormControl>
                  <DateTimePicker
                    onChange={field.onChange}
                    placeholder="Selecione data e hora de início"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e Hora de Término *</FormLabel>
                <FormControl>
                  <DateTimePicker
                    onChange={field.onChange}
                    placeholder="Selecione data e hora de término"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Auditório Principal - SEDUC Coreaú"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço Completo (opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Rua, número, bairro, cidade..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bannerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Banner (opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://exemplo.com/banner.jpg"
                  type="url"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                URL de uma imagem para o banner (16:9 recomendado)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Inicial *</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Rascunhos não ficam visíveis para os usuários
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            disabled={isLoading}
            onClick={() => router.back()}
            type="button"
            variant="outline"
          >
            Cancelar
          </Button>
          <Button disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Evento
          </Button>
        </div>
      </form>
    </Form>
  );
}
