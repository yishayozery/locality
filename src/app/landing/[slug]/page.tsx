export default async function LandingSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">דף נקודת איסוף</h1>
        <p className="text-gray-500 mb-2">עמוד זה בפיתוח</p>
        <p className="text-gray-400 text-sm">slug: {slug}</p>
      </div>
    </div>
  );
}
