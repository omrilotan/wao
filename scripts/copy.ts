#!/usr/bin/env node

import { cp } from "node:fs/promises";

cp("src/public", "docs", { recursive: true });
