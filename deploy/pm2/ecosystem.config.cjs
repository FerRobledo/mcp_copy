// pm2 process for mcp-popey (see docs/INSTALACION-VPS.txt, section 7).
// Copy to /opt/mcp-popey/ecosystem.config.cjs; paths assume that layout.
module.exports = {
  apps: [
    {
      name: 'mcp-popey',
      cwd: '/opt/mcp-popey/app',
      script: 'dist/index.js',
      // Isolated Node 22: the system Node (used by other pm2 apps) is not touched.
      interpreter: '/opt/mcp-popey/runtime/bin/node',
      exec_mode: 'fork',
      instances: 1, // the rate limiter is in-memory: keep a single instance
      max_memory_restart: '250M',
      // index.ts waits up to 5 s for in-flight requests on SIGINT; give it 6 s.
      kill_timeout: 6000,
      // A broken .env / YAML exits at once: stop retrying instead of looping forever.
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 2000,
      out_file: '/opt/mcp-popey/logs/out.log',
      error_file: '/opt/mcp-popey/logs/error.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        // These win over .env.
        MCP_HOST: '127.0.0.1',
        MCP_PORT: '3030',
      },
    },
  ],
};
