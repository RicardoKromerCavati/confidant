import { LogLevel } from "typescript-logging";
import { CategoryProvider, Category, CategoryConfigOptional } from "typescript-logging-category-style";


const provider = CategoryProvider.createProvider("LogProvider", {
  level: LogLevel.Info,
  dateFormatter: myUnixTimestamp => ``,
  channel: {
    type: "RawLogChannel",
    write: logMessage => console.log(`${logMessage.message}\n`),
  },
});

export function getLogger(name: string): Category {
  return provider.getCategory(name);
}