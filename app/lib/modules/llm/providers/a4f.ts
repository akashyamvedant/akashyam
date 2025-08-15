import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class A4FProvider extends BaseProvider {
  name = 'A4F';
  getApiKeyLink = 'https://www.a4f.co/dashboard';
  labelForGetApiKey = 'Get A4F API Key';
  icon = '/icons/A4F.svg';

  config = {
    baseUrlKey: 'A4F_API_BASE_URL',
    apiTokenKey: 'A4F_API_KEY',
    baseUrl: 'https://api.a4f.co/v1',
  };

  staticModels: ModelInfo[] = [
    // Popular Provider-3 models (high-end)
    {
      name: 'provider-3/gpt-4o',
      label: 'GPT-4o (Provider 3)',
      provider: 'A4F',
      maxTokenAllowed: 128000,
    },
    {
      name: 'provider-3/gpt-4o-mini',
      label: 'GPT-4o Mini (Provider 3)',
      provider: 'A4F',
      maxTokenAllowed: 128000,
    },
    {
      name: 'provider-3/gpt-4',
      label: 'GPT-4 (Provider 3)',
      provider: 'A4F',
      maxTokenAllowed: 8192,
    },
    {
      name: 'provider-3/deepseek-v3',
      label: 'DeepSeek V3 (Provider 3)',
      provider: 'A4F',
      maxTokenAllowed: 163840,
    },
    {
      name: 'provider-3/gemini-2.0-flash',
      label: 'Gemini 2.0 Flash (Provider 3)',
      provider: 'A4F',
      maxTokenAllowed: 1000000,
    },
    // Provider-2 models (good balance)
    {
      name: 'provider-2/gpt-4o',
      label: 'GPT-4o (Provider 2)',
      provider: 'A4F',
      maxTokenAllowed: 128000,
    },
    {
      name: 'provider-2/gpt-4o-mini',
      label: 'GPT-4o Mini (Provider 2)',
      provider: 'A4F',
      maxTokenAllowed: 128000,
    },
    {
      name: 'provider-2/deepseek-r1',
      label: 'DeepSeek R1 (Provider 2)',
      provider: 'A4F',
      maxTokenAllowed: 163840,
    },
    // Provider-1 models (cost-effective)
    {
      name: 'provider-1/deepseek-r1-0528',
      label: 'DeepSeek R1 (Provider 1)',
      provider: 'A4F',
      maxTokenAllowed: 163840,
    },
    {
      name: 'provider-1/llama-3.3-70b-instruct-turbo',
      label: 'Llama 3.3 70B Turbo (Provider 1)',
      provider: 'A4F',
      maxTokenAllowed: 128000,
    },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'A4F_API_BASE_URL',
      defaultApiTokenKey: 'A4F_API_KEY',
    });

    if (!apiKey) {
      throw `Missing Api Key configuration for ${this.name} provider`;
    }

    try {
      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`A4F API call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Get static model names to avoid duplicates
      const staticModelIds = this.staticModels.map((m) => m.name);
      
      // Filter for chat completion models only and exclude static models
      const dynamicModels = data.data?.filter((model: any) => 
        model.id && 
        model.type === 'chat/completion' &&
        !staticModelIds.includes(model.id)
      ) || [];

      return dynamicModels.map((model: any) => ({
        name: model.id,
        label: `${model.base_model} (${model.id.split('/')[0]})`,
        provider: this.name,
        maxTokenAllowed: model.context_window || 32000,
      }));
    } catch (error) {
      console.warn(`Failed to fetch dynamic models from A4F: ${error}`);
      return [];
    }
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'A4F_API_BASE_URL',
      defaultApiTokenKey: 'A4F_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const a4f = createOpenAI({
      apiKey,
      baseURL: baseUrl,
    });

    return a4f(model);
  }
}
