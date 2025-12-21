declare module "prompts" {
  export interface PromptObject {
    type: string;
    name: string;
    message: string;
    initial?: string | number;
    choices?: Array<{ title: string; value: string }>;
    validate?: (value: any) => boolean | string;
  }

  function prompts(
    questions: PromptObject | PromptObject[],
    options?: any
  ): Promise<Record<string, any>>;

  export default prompts;
}

