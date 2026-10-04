import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import {
  createContent,
  deleteContent,
  listContents,
  updateContent,
  type Content,
  type ContentType
} from "../../services/contentService";
import { listAllPlans, type Plan } from "../../services/adminService";
import {
  createSignedUrl,
  removeFromBucket,
  uploadToBucket,
  type StorageBucket
} from "../../services/storageService";

type Filter = "all" | ContentType;

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function bucketFor(type: ContentType): StorageBucket {
  if (type === "video") return "videos";
  if (type === "photo") return "photos";
  return "audios";
}

export default function AdminContents() {
  const [contents, setContents] = useState<Content[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<ContentType>("video");
  const [requiredPlanId, setRequiredPlanId] = useState<string>("");
  const [published, setPublished] = useState<boolean>(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, p] = await Promise.all([listContents(), listAllPlans()]);
      setContents(c);
      setPlans(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetModal() {
    setFile(null);
    setThumbFile(null);
    setTitle("");
    setDescription("");
    setContentType("video");
    setRequiredPlanId("");
    setPublished(true);
    setModalError(null);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  function handleThumbChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setThumbFile(f);
  }

  async function handleUpload() {
    if (!file) {
      setModalError("Escolhe um ficheiro");
      return;
    }
    if (!title.trim()) {
      setModalError("Titulo obrigatorio");
      return;
    }

    setUploading(true);
    setModalError(null);

    const bucket = bucketFor(contentType);
    const uploadResult = await uploadToBucket(bucket, file);
    if (!uploadResult.ok || !uploadResult.path) {
      setModalError(uploadResult.error ?? "Erro no upload");
      setUploading(false);
      return;
    }

    let thumbPath: string | null = null;
    if (thumbFile) {
      const thumbResult = await uploadToBucket("thumbnails", thumbFile);
      if (!thumbResult.ok || !thumbResult.path) {
        await removeFromBucket(bucket, uploadResult.path).catch(() => null);
        setModalError(thumbResult.error ?? "Erro no upload da thumbnail");
        setUploading(false);
        return;
      }
      thumbPath = thumbResult.path;
    }

    try {
      await createContent({
        title: title.trim(),
        description: description.trim() || null,
        content_type: contentType,
        storage_path: uploadResult.path,
        thumbnail_path: thumbPath,
        required_plan_id: requiredPlanId || null,
        published
      });
      setModalOpen(false);
      resetModal();
      await load();
    } catch (err) {
      await removeFromBucket(bucket, uploadResult.path).catch(() => null);
      if (thumbPath) await removeFromBucket("thumbnails", thumbPath).catch(() => null);
      setModalError(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setUploading(false);
    }
  }

  async function handleTogglePublished(c: Content) {
    try {
      await updateContent(c.id, { published: !c.published });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  async function handleDelete(c: Content) {
    try {
      await deleteContent(c.id);
      await removeFromBucket(bucketFor(c.content_type), c.storage_path).catch(() => null);
      if (c.thumbnail_path) {
        await removeFromBucket("thumbnails", c.thumbnail_path).catch(() => null);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  async function handlePreview(c: Content) {
    const url = await createSignedUrl(bucketFor(c.content_type), c.storage_path, 600);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  const filtered = filter === "all" ? contents : contents.filter((c) => c.content_type === filter);

  const planName = (id: string | null) => {
    if (!id) return "—";
    return plans.find((p) => p.id === id)?.name ?? "—";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white">CONTEUDOS</h1>
          <p className="mt-2 text-sm text-kb-gray">Videos, fotos e audios.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetModal();
            setModalOpen(true);
          }}
          className="btn-primary"
        >
          Adicionar conteudo
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "video", "photo", "audio"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              filter === f
                ? "border-kb-rose/50 bg-kb-rose/10 text-kb-roseSoft"
                : "border-kb-line text-kb-gray hover:border-kb-rose/40 hover:text-kb-rose"
            ].join(" ")}
          >
            {f === "all" ? "Todos" : f === "video" ? "Videos" : f === "photo" ? "Fotos" : "Audios"}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
          {error}
        </p>
      )}

      <div className="card-premium glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-kb-line/60 text-[10px] uppercase tracking-[0.25em] text-kb-graySoft">
              <tr>
                <th className="px-4 py-3">Titulo</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Criado</th>
                <th className="px-4 py-3 text-right">Accoes</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-kb-gray">
                    A carregar...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-kb-gray">
                    Sem conteudos.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-kb-line/30 last:border-0">
                    <td className="px-4 py-3 text-kb-white">{c.title}</td>
                    <td className="px-4 py-3 text-kb-gray">{c.content_type}</td>
                    <td className="px-4 py-3 text-kb-rose">{planName(c.required_plan_id)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]",
                          c.published
                            ? "border-emerald-400/40 text-emerald-300"
                            : "border-kb-line text-kb-graySoft"
                        ].join(" ")}
                      >
                        {c.published ? "publicado" : "rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-kb-graySoft">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void handlePreview(c)}
                          className="text-xs text-kb-gray hover:text-kb-rose"
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleTogglePublished(c)}
                          className="text-xs text-kb-gray hover:text-kb-rose"
                        >
                          {c.published ? "Despublicar" : "Publicar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(c)}
                          className="text-xs text-kb-gray hover:text-kb-rose"
                        >
                          Apagar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card-premium glass max-h-[90vh] w-full max-w-md overflow-y-auto p-6">
            <h2 className="font-display text-2xl tracking-[0.2em] text-kb-white">
              NOVO CONTEUDO
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Tipo
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                >
                  <option value="video">Video</option>
                  <option value="photo">Foto</option>
                  <option value="audio">Audio</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Ficheiro
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none file:mr-3 file:rounded-full file:border-0 file:bg-kb-rose/20 file:px-3 file:py-1 file:text-xs file:text-kb-roseSoft"
                />
                {file && (
                  <span className="text-[10px] text-kb-graySoft">
                    {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Thumbnail (opcional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbChange}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none file:mr-3 file:rounded-full file:border-0 file:bg-kb-rose/20 file:px-3 file:py-1 file:text-xs file:text-kb-roseSoft"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Titulo
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Descricao (opcional)
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Plano necessario
                <select
                  value={requiredPlanId}
                  onChange={(e) => setRequiredPlanId(e.target.value)}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                >
                  <option value="">Livre (qualquer utilizador)</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-3 text-xs text-kb-gray">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 accent-pink-500"
                />
                Publicar imediatamente
              </label>

              {modalError && (
                <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
                  {modalError}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleUpload()}
                  disabled={uploading || !file}
                  className="btn-primary flex-1"
                >
                  {uploading ? "A enviar..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    resetModal();
                  }}
                  className="btn-ghost"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
