import { Aleph } from '../server/aleph.ts'
import { serve } from '../server/mod.ts'
import { getFlag, parsePortNumber } from '../shared/flags.ts'
import log from '../shared/log.ts'

export const helpMessage = `
Usage:
    aleph dev <dir> [...options]

<dir> represents the directory of Aleph.js app,
if the <dir> is empty, the current directory will be used.

Options:
    -p, --port      <port>       A port number to start the Aleph.js app, default is 8080
        --hostname  <hostname>   The address at which the server is to be started
        --tls-cert  <cert-file>  The server certificate file
        --tls-key   <key-file>   The server public key file
    -L, --log-level <log-level>  Set log level [possible values: debug, info]
    -r, --reload                 Reload source code cache
    -h, --help                   Prints help message
`

export default async function (workingDir: string, flags: Record<string, any>) {
  const aleph = new Aleph(workingDir, 'development', Boolean(flags.r || flags.reload))
  const port = parsePortNumber(getFlag(flags, ['p', 'port'], '8080'))
  const hostname = getFlag(flags, ['hostname'])
  const certFile = getFlag(flags, ['tls-cert'])
  const keyFile = getFlag(flags, ['tls-key'])
  if (keyFile !== undefined && certFile === undefined) {
    log.fatal('missing `--tls-cert` option')
  } else if (certFile !== undefined && keyFile === undefined) {
    log.fatal('missing `--tls-key` option')
  }
  await serve({ aleph, port, hostname, certFile, keyFile })
}
