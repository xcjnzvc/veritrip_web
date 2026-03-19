"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import AdminInput from "./AdminInput";
import AdminTextarea from "./AdminTextarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgentCreateDto } from "@/lib/api/agent";
import { useCreate } from "@refinedev/core";

interface AgentCreateFormProps {
  onSuccess: () => void;
}

export default function AgentCreateForm({ onSuccess }: AgentCreateFormProps) {
  const { mutate, mutation } = useCreate();

  const [form, setForm] = useState<AgentCreateDto>({
    name: "",
    description: "",
    rolePrompt: "",
    taskPrompt: "",
    outputPrompt: "",
    provider: "GEMINAI",
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
          onSuccess();
        },
      },
    );
  };

  const isSubmitting = mutation.isPending;

  return (
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

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Provider</span>
        <Select
          value={form.provider}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              provider: value as AgentCreateDto["provider"],
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Provider를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GEMINAI">재미나이</SelectItem>
            <SelectItem value="XAI">그록</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AdminInput
        label="Model ID"
        placeholder="사용할 모델 ID를 입력하세요"
        value={form.modelId}
        onChange={handleChange("modelId")}
        required
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "생성 중..." : "생성하기"}
        </Button>
      </div>
    </form>
  );
}
