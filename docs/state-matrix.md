# State matrix

Source of truth for component states. Mirrors the Week 8 Figma page
"Makemova / Geometric crew → 4. Components". If code and this file disagree, fix one of them on purpose.

| Component | Prop | Values |
|---|---|---|
| PillAction | `type` | `primary`, `secondary` |
| PillAction | `state` | `default`, `hover`, `disabled` |
| FocusChoice | `state` | `default`, `selected` |
| TextField | `state` | `default`, `focused`, `filled`, `error`, `disabled`, `readOnly` |
| ScreenshotUpload | `state` | `empty`, `dragOver`, `uploading`, `attached`, `error` |
| LearningPath | `stage` | `brief`, `make`, `revise`, `reflect` |
| FeedbackNote | `state` | `default`, `selected`, `resolved` |
| StatusNotice | `state` | `saved`, `running`, `error`, `insufficientCredits` |
| NavigationItem | `state` | `default`, `hover`, `selected` |
| Breadcrumb | `depth` | `two`, `three` |
| DecisionPanel | `state` | `empty`, `reasonReady` |

## Every screen

| State | What the screen shows |
|---|---|
| Loading | A spinner in place of the content. Layout does not jump. |
| Empty | One sentence on what goes here and the one action that fills it. Dashed border. |
| Error | What went wrong in plain words, what is safe, and a retry action. Mate orange + words. |
| Ready | The content. |

## Outline rule

Filled = no outline. Resting = 1 px border. Focus = 2 px Arti blue. Not yet = dashed. Needs you = 2 px Mate orange + words.
