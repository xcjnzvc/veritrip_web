"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRunAgentMutation } from "@/lib/queries/agent";
import type { AgentRunResponse } from "@/lib/types/agent";
import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import AdminModalDialog from "../../components/AdminModalDialog";
import AdminTextarea from "../../components/AdminTextarea";

type AdminAgentRunDialogProps = {
  agentId: string;
  agentLabel: string;
  onClose: () => void;
};

function formatRunError(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    if (data && typeof data.message === "string") return data.message;
    return err.message || "요청에 실패했습니다.";
  }
  if (err instanceof Error) return err.message;
  return "알 수 없는 오류가 발생했습니다.";
}

export default function AdminAgentRunDialog({
  agentId,
  agentLabel,
  onClose,
}: AdminAgentRunDialogProps) {
  const runMutation = useRunAgentMutation();
  const [prompt, setPrompt] = useState("");
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [response, setResponse] = useState<AgentRunResponse | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleRun = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      setClientError("프롬프트를 입력하세요.");
      return;
    }
    setClientError(null);

    runMutation.mutate(
      {
        id: agentId,
        body: {
          prompt: trimmed,
          useGoogleSearch: useGoogleSearch || undefined,
        },
      },
      {
        onSuccess: (data) => {
          setClientError(null);
          setResponse(data);
        },
        onError: (err) => {
          setResponse(null);
          setClientError(formatRunError(err));
        },
      },
    );
  };

  const resultData = response?.data;

  return (
    <AdminModalDialog
      title="에이전트 실행"
      subtitle={`${agentLabel} · POST /mgmt/agents/:id/run`}
      onClose={onClose}
      className="max-h-[90vh] max-w-2xl overflow-hidden"
    >
      <form onSubmit={handleRun} className="flex max-h-[calc(90vh-5rem)] flex-col gap-4">
        <AdminTextarea
          label="프롬프트"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="에이전트에게 전달할 내용을 입력하세요."
          rows={5}
          required
        />

        <div className="flex items-center gap-2">
          <input
            id="agent-run-google-search"
            type="checkbox"
            checked={useGoogleSearch}
            onChange={(e) => setUseGoogleSearch(e.target.checked)}
            className="border-input size-4 rounded border"
          />
          <Label htmlFor="agent-run-google-search" className="text-sm font-normal">
            Google Search Grounding 사용
          </Label>
        </div>

        {clientError ? (
          <p className="text-destructive text-sm" role="alert">
            {clientError}
          </p>
        ) : null}

        <div className="flex shrink-0 justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={runMutation.isPending}>
            닫기
          </Button>
          <Button type="submit" variant="primary" disabled={runMutation.isPending}>
            {runMutation.isPending ? "실행 중…" : "실행"}
          </Button>
        </div>

        <div className="border-border min-h-0 flex-1 space-y-3 overflow-y-auto rounded-lg border p-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            결과
          </p>
          {!response && !runMutation.isPending && !clientError ? (
            <p className="text-muted-foreground text-sm">실행하면 여기에 응답이 표시됩니다.</p>
          ) : null}
          {runMutation.isPending ? (
            <p className="text-muted-foreground text-sm">응답을 기다리는 중…</p>
          ) : null}
          {response ? (
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <span className="text-muted-foreground">code:</span> {response.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-muted-foreground">message:</span> {response.message}
                </span>
              </div>
              {resultData ? (
                <>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">text</p>
                    <pre className="bg-muted max-h-48 overflow-auto whitespace-pre-wrap rounded-md p-3 text-xs">
                      {resultData.text}
                    </pre>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">sources</p>
                    <pre className="bg-muted max-h-40 overflow-auto rounded-md p-3 text-xs">
                      {JSON.stringify(resultData.sources ?? [], null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-xs">data가 없습니다.</p>
              )}
            </div>
          ) : null}
        </div>
      </form>
    </AdminModalDialog>
  );
}
