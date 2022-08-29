import * as dotenv from 'dotenv';

import { getDataSource } from './common';

dotenv.config();

export const dataSource = getDataSource();
