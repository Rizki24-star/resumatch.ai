// stores/puter.ts
import { defineStore } from "pinia";

declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };
      fs: {
        write: (
          path: string,
          data: string | File | Blob
        ) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob>;
        upload: (file: File[] | Blob[]) => Promise<FSItem>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<FSItem[] | undefined>;
      };
      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<Object>;
        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>;
      };
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
        flush: () => Promise<boolean>;
      };
    };
  }
}

export const usePuterStore = defineStore("puter", {
  state: () => ({
    isLoading: true,
    error: null as string | null,
    puterReady: false,
  }),

  getters: {
    getPuter(): typeof window.puter | null {
      if (process.client && window.puter) {
        return window.puter;
      }
      return null;
    },
  },

  actions: {
    setError(msg: string) {
      this.error = msg;
      this.isLoading = false;
    },

    clearError() {
      this.error = null;
    },

    init() {
      if (!process.client) return;

      const puter = this.getPuter;
      if (puter) {
        this.puterReady = true;
        this.isLoading = false;
        return;
      }

      const interval = setInterval(() => {
        if (this.getPuter) {
          clearInterval(interval);
          this.puterReady = true;
          this.isLoading = false;
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        if (!this.getPuter) {
          this.setError("Puter.js failed to load within 10 seconds");
        }
      }, 10000);
    },

    // File System Methods
    async write(
      path: string,
      data: string | File | Blob
    ): Promise<File | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.fs.write(path, data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to write file";
        this.setError(msg);
      }
    },

    async read(path: string): Promise<Blob | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.fs.read(path);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to read file";
        this.setError(msg);
      }
    },

    async readDir(path: string): Promise<FSItem[] | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.fs.readdir(path);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to read directory";
        this.setError(msg);
      }
    },

    async upload(files: File[] | Blob[]): Promise<FSItem | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.fs.upload(files as any);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to upload files";
        this.setError(msg);
      }
    },

    async deleteFile(path: string): Promise<void> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        await puter.fs.delete(path);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to delete file";
        this.setError(msg);
      }
    },

    // AI Methods
    async chat(
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions
    ): Promise<AIResponse | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return (await puter.ai.chat(
          prompt,
          imageURL,
          testMode,
          options
        )) as AIResponse;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "AI chat failed";
        this.setError(msg);
      }
    },

    async feedback(
      path: string,
      message: string
    ): Promise<AIResponse | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return (await puter.ai.chat(
          [
            {
              role: "user",
              content: [
                {
                  type: "file",
                  puter_path: path,
                },
                {
                  type: "text",
                  text: message,
                },
              ],
            },
          ],
          { model: "claude-sonnet-4" }
        )) as AIResponse;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "AI feedback failed";
        this.setError(msg);
      }
    },

    async img2txt(
      image: string | File | Blob,
      testMode?: boolean
    ): Promise<string | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.ai.img2txt(image, testMode);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Image to text conversion failed";
        this.setError(msg);
      }
    },

    // Key-Value Store Methods
    async getKV(key: string): Promise<string | null | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.kv.get(key);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get KV";
        this.setError(msg);
      }
    },

    async setKV(key: string, value: string): Promise<boolean | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.kv.set(key, value);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to set KV";
        this.setError(msg);
      }
    },

    async deleteKV(key: string): Promise<boolean | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.kv.delete(key);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete KV";
        this.setError(msg);
      }
    },

    async listKV(
      pattern: string,
      returnValues: boolean = false
    ): Promise<string[] | KVItem[] | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.kv.list(pattern, returnValues);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to list KV";
        this.setError(msg);
      }
    },

    async flushKV(): Promise<boolean | undefined> {
      const puter = this.getPuter;
      if (!puter) {
        this.setError("Puter.js not available");
        return;
      }
      try {
        return await puter.kv.flush();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to flush KV";
        this.setError(msg);
      }
    },
  },
});
