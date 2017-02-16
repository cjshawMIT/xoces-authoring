Note that the `/api/v1/learning/objectivebanks` endpoint is expected to return a JSON structure
like this, that defines which of the views to show in the UI:


```
BANK_IDS = [('mc3-objectivebank%3A11%40MIT-OEIT',  #MIToces
             {
                 'hasDepartments': True,
                 'hasModules': True,
                 'hasOutcomes': True,
                 'hasSubjects': True,
                 'hasSuboutcomes': False
             }),
            ('mc3-objectivebank%3A2814%40MIT-OEIT',  #SUTDoces
             {
                 'hasDepartments': False,
                 'hasModules': False,
                 'hasOutcomes': True,
                 'hasSubjects': True,
                 'hasSuboutcomes': False
             }),
            ('mc3-objectivebank%3A2815%40MIT-OEIT',  #FBWoces
             {
                 'hasDepartments': True,
                 'hasModules': True,
                 'hasOutcomes': True,
                 'hasSubjects': True,
                 'hasSuboutcomes': False
             }),
            ('mc3-objectivebank%3A2821%40MIT-OEIT',  # FbW Accounting
             {
                 'hasDepartments': False,
                 'hasModules': True,
                 'hasOutcomes': True,
                 'hasSubjects': False,
                 'hasSuboutcomes': False
             }),
            ('mc3-objectivebank%3A2822%40MIT-OEIT',  # FbW CAD
             {
                 'hasDepartments': False,
                 'hasModules': True,
                 'hasOutcomes': True,
                 'hasSubjects': False,
                 'hasSuboutcomes': False
             }),
            ('mc3-objectivebank%3A2823%40MIT-OEIT',  # FbW Algebra
             {
                 'hasDepartments': False,
                 'hasModules': True,
                 'hasOutcomes': True,
                 'hasSubjects': False,
                 'hasSuboutcomes': False
             })]
```