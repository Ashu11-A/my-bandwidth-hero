import childProcess from 'child_process';

let child: childProcess.ChildProcess;
let restartCount = 0;
const maxRestartAttempts = 3;

function startChildProcess() {
  if (restartCount < maxRestartAttempts) {
    console.log(`Iniciando o processo filho. Tentativa ${restartCount + 1}`);
    child = childProcess.spawn('npm', ['start'], { shell: true, stdio: 'inherit' }); // Redirecione a saída para o console

    child.on('close', function (exitcode) {
      if (exitcode !== 0) {
        console.log(`O processo filho foi encerrado com código de saída ${exitcode}.`);
        restartChildProcess();
      }
    });

    child.on('error', function (err) {
      console.log('Erro ao iniciar o processo filho:', err);
      restartChildProcess();
    });

    restartCount++;
  } else {
    console.log(`Número máximo de tentativas de reinicialização (${maxRestartAttempts}) alcançado. Saindo.`);
    process.exit(1);
  }
}

function restartChildProcess() {
  console.log('Reiniciando o processo filho...');
  child.kill();
  setTimeout(startChildProcess, 1000);
}

startChildProcess();

process.on('exit', function () {
  if (child) {
    child.kill();
  }
});
