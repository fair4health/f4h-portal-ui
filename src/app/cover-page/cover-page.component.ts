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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export interface ResearchElement {
  number: number;
  description: string;
  sites: number;
  patients: number;
  algorithm: string;
}

const ELEMENT_DATA: ResearchElement[] = [
  { number: 1,
    description: 'Identification of multimorbidity patterns and polypharmacy correlation on the risk of mortality in elderly, and demonstrate the reproducibility of research',
    sites: 5,
    patients: 11.486,
    algorithm: 'FP Growth'
  },
  { number: 2,
    description: 'Develop and pilot an early prediction service for 30-days readmission risk in COPD (Chronic Obstructive Pulmonary Disease) patients',
    sites: 3,
    patients: 4.944,
    algorithm: 'Support Vector Machine (SVM), Logistic Regression, Decision Trees, Random Forest, Gradient Boosted Trees'
  },
];

@Component({
  selector: 'app-cover-page',
  templateUrl: './cover-page.component.html',
  styleUrls: ['./cover-page.component.css']
})

export class CoverPageComponent implements OnInit {
  displayedColumns: string[] = ['number', 'description', 'sites', 'patients', 'algorithm'];
  dataSource = ELEMENT_DATA;
  constructor(
    private router: Router,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Redirecting to usecase list as default page', this.auth.isLoggedIn());
    if (this.auth.isLoggedIn()){
      this.router.navigate(['/uclist']);
    }
  }

}
