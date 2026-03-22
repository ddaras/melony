import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';

const program = new Command();

program
  .name('create-melony-app')
  .description('Scaffold a new Melony agent app in seconds')
  .version('0.1.0')
  .argument('[project-name]', 'name of your project')
  .action(async (projectName) => {
    console.log(chalk.green(`
   __  ___    __                  
  /  |/  /___/ /___  ___  __ __ 
 / /|_/ / __/ / __ \\/ _ \\/ // / 
/_/  /_/\\___/_/\\___/_//_/\\_, /  
                        /___/   
    `));
    console.log(chalk.bold('Welcome to the Melony App Creator!'));

    const response = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'What is your project name?',
        initial: projectName || 'my-melony-app'
      },
      {
        type: 'select',
        name: 'template',
        message: 'Which template would you like to use?',
        choices: [
          { title: 'Express (Starter)', value: 'express' }
        ],
        initial: 0
      },
      {
        type: 'number',
        name: 'port',
        message: 'Which port should the server run on?',
        initial: 7777
      }
    ]);

    if (!response.name) {
      console.log(chalk.red('Project name is required.'));
      process.exit(1);
    }

    const targetDir = path.resolve(process.cwd(), response.name);
    
    if (await fs.pathExists(targetDir)) {
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Directory ${response.name} already exists. Overwrite?`,
        initial: false
      });

      if (!confirm) {
        process.exit(1);
      }
      await fs.emptyDir(targetDir);
    }

    const templateDir = path.join(__dirname, '..', 'templates', response.template);

    console.log(`\nCreating Melony app in ${chalk.cyan(targetDir)}...`);

    // 1. Copy template
    await fs.copy(templateDir, targetDir);

    // 2. Update package.json
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = response.name;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // 3. Update .env or config (if any)
    const envPath = path.join(targetDir, '.env');
    if (await fs.pathExists(path.join(targetDir, '.env.example'))) {
      await fs.copy(path.join(targetDir, '.env.example'), envPath);
      let envContent = await fs.readFile(envPath, 'utf8');
      // Replace any PORT= definition
      envContent = envContent.replace(/^PORT=.*$/m, `PORT=${response.port}`);
      await fs.writeFile(envPath, envContent);
    }

    console.log(`\n${chalk.green('Success!')} Created ${chalk.bold(response.name)} at ${targetDir}`);
    console.log('\nNext steps:');
    console.log(chalk.cyan(`  cd ${response.name}`));
    console.log(chalk.cyan('  pnpm install'));
    console.log(chalk.cyan('  pnpm dev'));
    console.log(`\nThen connect to Studio at: ${chalk.bold('https://studio.melony.dev?agent=http://localhost:' + response.port + '/chat')}`);
  });

program.parse();
