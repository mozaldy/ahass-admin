import { PendaftaranForm } from "@/components/form/pkb/pendaftaran-form";
import { getpkbById } from "@/data/pkb";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getpkbById(params.id);
  if (data === null) return <div>PKB tidak ditemukan</div>;
  console.log("Data edit", data);
  return (
    <>
      <h1 className="font-black text-4xl">Pendaftaran PKB</h1>
      <PendaftaranForm initialValues={data} is_pendaftaran={false} />
    </>
  );
}
