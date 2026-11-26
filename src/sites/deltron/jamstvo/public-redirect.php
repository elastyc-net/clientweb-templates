<?php
/** Deltron-only compatibility entrypoint. Keep POST bodies on the same origin. */
if (PHP_SAPI === 'cli') { return; }
header('Cache-Control: no-store');
header('Location: /incKomponente/auth/deltron-jamstvo.php', true, 307);
