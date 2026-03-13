"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { AdminTitle } from "../../components/title";
import AdminInput from "../components/AdminInput";
import AdminTextarea from "../components/AdminTextarea";
import { AgentCreateDto } from "@/lib/api/agent";
import { useCreate, useNavigation } from "@refinedev/core";

export default function AgentCreatePage() {
  const { list } = useNavigation();
  const { mutate, mutation } = useCreate();

  const [form, setForm] = useState<AgentCreateDto>({
    name: "",
    description: "",
    rolePrompt: "",
    taskPrompt: "",
    outputPrompt: "",
    provider: "XAI",
    modelId: "",
  });

  const handleChange =
    (field: keyof AgentCreateDto) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        resource: "agents",
        values: form,
      },
      {
        onSuccess: () => {
          list("agents");
        },
      },
    );
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminTitle>에이전트 생성</AdminTitle>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="에이전트 이름"
          placeholder="에이전트 이름을 입력하세요"
          value={form.name}
          onChange={handleChange("name")}
          required
        />

        <AdminTextarea
          label="설명"
          placeholder="에이전트에 대한 설명을 입력하세요"
          value={form.description}
          onChange={handleChange("description")}
          required
        />

        <AdminTextarea
          label="Role Prompt"
          placeholder="에이전트의 역할을 설명하는 시스템 프롬프트"
          value={form.rolePrompt}
          onChange={handleChange("rolePrompt")}
          required
        />

        <AdminTextarea
          label="Task Prompt"
          placeholder="에이전트가 수행해야 할 작업에 대한 프롬프트"
          value={form.taskPrompt}
          onChange={handleChange("taskPrompt")}
          required
        />

        <AdminTextarea
          label="Output Prompt"
          placeholder="에이전트 출력 형식을 정의하는 프롬프트"
          value={form.outputPrompt}
          onChange={handleChange("outputPrompt")}
          required
        />

        <AdminInput
          label="Provider"
          value={form.provider}
          readOnly
        />

        <AdminInput
          label="Model ID"
          placeholder="사용할 모델 ID를 입력하세요"
          value={form.modelId}
          onChange={handleChange("modelId")}
          required
        />

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-700 text-sm hover:bg-gray-800"
            onClick={() => list("agents")}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-sm text-white hover:bg-blue-500 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "생성 중..." : "생성하기"}
          </button>
        </div>
      </form>
    </div>
  );
}