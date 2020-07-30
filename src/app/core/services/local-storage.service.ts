import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  projectId: string;

  constructor() { }

  setProjectId(projectId): void {
    this.projectId = projectId;
    console.log('A new projectId has been set: ' + projectId);
  }
}
