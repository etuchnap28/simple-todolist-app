import chalk from 'chalk';
import {format} from 'date-fns';

export default class Logging {
  public static log = (args: any) => this.info(args);
  
  public static info = (args: any) => console.log(chalk.blue(`[${format(new Date(), 'dd.MM.yyyy HH:mm:ss')}][INFO]`), typeof args === 'string' ? chalk.blueBright(args) : args);
  public static warn = (args: any) => console.log(chalk.yellow(`${format(new Date(), 'dd.MM.yyyy HH:mm:ss')}][WARNING] `), typeof args === 'string' ? chalk.yellowBright(args) : args);
  public static error = (error: any) => {
    const customError: boolean = error.constructor.name === 'NodeError' || error.constructor.name === 'SyntaxError' ? false : true;
    
    console.log(chalk.red(`[${format(new Date(), 'dd.MM.yyyy HH:mm:ss')}][ERROR] `, chalk.redBright(`${customError ? error.constructor.name : 'UnhandledError'}`)));
  }
}