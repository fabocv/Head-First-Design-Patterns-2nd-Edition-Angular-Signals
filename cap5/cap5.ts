class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, any> = {};

  private constructor() {} 

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public set(key: string, value: any) {
    this.config[key] = value;
  }

  public get(key: string) {
    return this.config[key];
  }
}

// Uso
const config1 = ConfigManager.getInstance();
config1.set("api", "google.com");

const config2 = ConfigManager.getInstance();
console.log(config1 === config2); // true 
