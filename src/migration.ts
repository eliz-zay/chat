import * as dotenv from 'dotenv';

import { getDataSource } from './common/db';

dotenv.config();

export const dataSource = getDataSource();
