/**
 * @license
 * Copyright (C) 2020  Atos Spain SA. All rights reserved.
 *
 * Use of this source code is governed by a license style Apache License, Version 2.0 that can be
 * found in the LICENSE file at https://github.com/fair4health/f4h-portal-ui/blob/master/LICENSE
 *
 * The software is provided "AS IS", without any warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a particular
 * purpose and noninfringement, in no event shall the authors or copyright holders be
 * liable for any claim, damages or other liability, whether in action of contract, tort or
 * otherwise, arising from, out of or in connection with the software or the use or other
 * dealings in the software.
 *
 * See README file for the full disclaimer information and LICENSE file for full license
 * information in the project root.
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  projectId: string;
  projectName: string;
  projectType: string;
  userId: string;

  constructor() { }

  setProjectId(projectId): void {
    this.projectId = projectId;
    console.log('A new projectId has been set: ' + projectId);
  }

  setProjectName(projectName): void {
    this.projectName = projectName;
    console.log('A new project name: ' + this.projectName);
  }

  setProjectType(projectType): void {
    this.projectType = projectType;
  }

  setUserId(id: string): void {
    this.userId = id;
  }

  reset(): void {
    this.projectId = '';
    this.projectName = '';
  }
}
