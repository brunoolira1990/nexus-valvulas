const fs = require('fs');
const path = require('path');

// Monitoring dashboard generator
const generateMonitoringDashboard = () => {
  console.log('Gerando Dashboard de Monitoramento...');
  console.log('====================================');
  
  // Check if logs directory exists
  const logsDir = path.join(__dirname, '..', 'backend', 'logs');
  if (!fs.existsSync(logsDir)) {
    console.log('❌ Diretório de logs não encontrado');
    return;
  }
  
  // Check log files
  const logFiles = fs.readdirSync(logsDir);
  console.log(`✅ Diretório de logs encontrado com ${logFiles.length} arquivos`);
  
  // Check for PM2
  try {
    require('child_process').execSync('pm2 -v', { stdio: 'pipe' });
    console.log('✅ PM2 está instalado');
  } catch (error) {
    console.log('❌ PM2 não está instalado');
  }
  
  // Check for Nginx
  try {
    require('child_process').execSync('nginx -v', { stdio: 'pipe' });
    console.log('✅ Nginx está instalado');
  } catch (error) {
    console.log('ℹ️  Nginx não está instalado (pode estar em outro servidor)');
  }
  
  // Check for PostgreSQL
  try {
    require('child_process').execSync('psql --version', { stdio: 'pipe' });
    console.log('✅ PostgreSQL client está instalado');
  } catch (error) {
    console.log('ℹ️  PostgreSQL client não está instalado localmente');
  }
  
  // Generate monitoring report
  const report = {
    timestamp: new Date().toISOString(),
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    },
    services: {
      frontend: 'Static files served by Nginx',
      backend: 'Node.js Express app (PM2)',
      database: 'PostgreSQL'
    },
    monitoring: {
      logs: logFiles,
      healthChecks: [
        'API endpoints',
        'Database connectivity',
        'Static file serving',
        'SSL certificates'
      ]
    }
  };
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'monitoring-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`✅ Relatório de monitoramento salvo em: ${reportPath}`);
  
  console.log('\n📋 Recomendações de Monitoramento:');
  console.log('1. Configurar monitoramento de uptime (UptimeRobot, Pingdom)');
  console.log('2. Configurar alertas de erro (Sentry, Rollbar)');
  console.log('3. Monitorar performance (Google PageSpeed Insights)');
  console.log('4. Monitorar banco de dados (pgAdmin, ptop)');
  console.log('5. Monitorar recursos do sistema (htop, iotop)');
  console.log('6. Configurar logs centralizados (ELK Stack, Graylog)');
  
  console.log('\n📊 Métricas Recomendadas:');
  console.log('- Tempo de resposta da API');
  console.log('- Taxa de erro 5xx');
  console.log('- Tempo de carregamento da página');
  console.log('- Core Web Vitals');
  console.log('- Uso de CPU e memória');
  console.log('- Conexões simultâneas');
  console.log('- Taxa de sucesso de queries no banco');
};

generateMonitoringDashboard();