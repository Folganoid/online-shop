export default class ErrorHandler {

    public errorHandler <Type>(err: Type): void {
        if (err instanceof Error) {
          console.log(`Error: ${err.message}... Please connect with support.`);
          console.log(err);
        } else if (typeof err === "string") {
            console.log(`Error: ${err}... Please connect with support.`);
        }
      }

}