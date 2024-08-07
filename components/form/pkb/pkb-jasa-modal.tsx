import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";

import type { Jasa } from "@prisma/client";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { jasaModalSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function JasaModal({
  onAddItem,
  initialValues,
}: {
  onAddItem: (item: any) => void;
  initialValues?: any;
}) {
  const form = useForm<z.infer<typeof jasaModalSchema>>({
    resolver: zodResolver(jasaModalSchema),
    defaultValues: initialValues || {
      total_harga_jasa: "",
      harga_jasa: 0,
      kode_jasa: "",
      nama_jasa: "",
      tambahan_harga_jasa: 0,
      persentase_diskon: 0,
      opl: "tidak",
    },
  });
  const [selectedItem, setSelectedItem] = useState<Jasa | null>(null);

  const harga_jasa = useWatch({ control: form.control, name: "harga_jasa" });
  const tambahan_harga_jasa = useWatch({
    control: form.control,
    name: "tambahan_harga_jasa",
  });
  const persentase_diskon = useWatch({
    control: form.control,
    name: "persentase_diskon",
  });

  useEffect(() => {
    const harga = harga_jasa;
    const tambahan = tambahan_harga_jasa || 0;
    const diskon = persentase_diskon || 0;

    const total = (harga + tambahan) * (1 - diskon / 100);

    form.setValue("total_harga_jasa", total);
  }, [harga_jasa, tambahan_harga_jasa, persentase_diskon, form]);

  async function handleSubmit() {
    const values = form.getValues();
    const selected = {
      ...values,
      jasa: selectedItem,
    };
    const result = jasaModalSchema.safeParse(selected);
    onAddItem(result.data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-5">
          Tambah Jasa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-5/6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Jasa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Combobox
                form={form}
                label="Kode Jasa"
                name="kode_jasa"
                apiEndpoint="/api/jasa"
                searchParam="kode"
                itemToComboboxItem={(jasa: Jasa) => {
                  return {
                    value: jasa.kode,
                    label: jasa.kode,
                    description: jasa.nama,
                    data: jasa,
                  };
                }}
                onSelectItem={(item) => {
                  form.setValue("nama_jasa", item.description);
                  form.setValue("harga_jasa", item.data.hargaJual);
                  setSelectedItem(item.data);
                }}
              />
              <FormField
                control={form.control}
                name="nama_jasa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Jasa</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="harga_jasa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Jasa</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="0" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tambahan_harga_jasa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tambahan Harga Jasa</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="persentase_diskon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persentase Diskon</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_harga_jasa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Harga Jasa</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="0" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="opl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OPL</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value || "iya"}
                        onValueChange={field.onChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="iya" id="iya" />
                          <Label htmlFor="iya">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tidak" id="tidak" />
                          <Label htmlFor="tidak">Tidak</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="button" onClick={handleSubmit}>
                Save changes
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}