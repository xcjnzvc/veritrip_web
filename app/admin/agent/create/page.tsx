"use client";

import { FormEvent, useState } from "react";
import { AdminTitle } from "../../components/title";
import { FieldWrapper, AdminInput, AdminTextarea } from "../components/FormControls";
import { useCreateAgentMutation } from "@/lib/queries/agent";
import { AgentCreateDto } from "@/lib/api/agent";
import { useRouter } from "next/navigation";

export default function AgentCreatePage() {
    const router = useRouter();
    const createMutation = useCreateAgentMutation();

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
        (field: keyof AgentCreateDto) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));
        };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await createMutation.mutateAsync(form);
        router.push("/admin/agent");
    };

    const isSubmitting = createMutation.isPending;

    return (
        <div className="space-y-6 max-w-3xl">
            <AdminTitle>에이전트 생성</AdminTitle>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FieldWrapper label="에이전트 이름" required>
                    <AdminInput
                        placeholder="에이전트 이름을 입력하세요"
                        value={form.name}
                        onChange={handleChange("name")}
                        required
                    />
                </FieldWrapper>

                <FieldWrapper label="설명" required>
                    <AdminTextarea
                        placeholder="에이전트에 대한 설명을 입력하세요"
                        value={form.description}
                        onChange={handleChange("description")}
                        required
                    />
                </FieldWrapper>

                <FieldWrapper label="Role Prompt" required>
                    <AdminTextarea
                        placeholder="에이전트의 역할을 설명하는 시스템 프롬프트"
                        value={form.rolePrompt}
                        onChange={handleChange("rolePrompt")}
                        required
                    />
                </FieldWrapper>

                <FieldWrapper label="Task Prompt" required>
                    <AdminTextarea
                        placeholder="에이전트가 수행해야 할 작업에 대한 프롬프트"
                        value={form.taskPrompt}
                        onChange={handleChange("taskPrompt")}
                        required
                    />
                </FieldWrapper>

                <FieldWrapper label="Output Prompt" required>
                    <AdminTextarea
                        placeholder="에이전트 출력 형식을 정의하는 프롬프트"
                        value={form.outputPrompt}
                        onChange={handleChange("outputPrompt")}
                        required
                    />
                </FieldWrapper>

                <FieldWrapper label="Provider" required>
                    <AdminInput value={form.provider} readOnly />
                </FieldWrapper>

                <FieldWrapper label="Model ID" required>
                    <AdminInput
                        placeholder="사용할 모델 ID를 입력하세요"
                        value={form.modelId}
                        onChange={handleChange("modelId")}
                        required
                    />
                </FieldWrapper>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-md border border-gray-700 text-sm hover:bg-gray-800"
                        onClick={() => router.back()}
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