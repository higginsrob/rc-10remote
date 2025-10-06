Your task is to generate this repository, including a .github/copilot-instructions.md file that contains information describing how a coding agent seeing it for the first time can work most efficiently.

You will do this task only one time per repository and doing a good job can SIGNIFICANTLY improve the quality of the agent's work, so take your time, think carefully, and search thoroughly before writing the instructions.

<Goals>
- Provide the agent with all the information it needs to understand the codebase, build, test, validate, and demo changes.
- Minimize the amount of searching the agent has to do to understand the codebase each time.
- Build the dev tooling to support the agent in building, testing, validating, and demoing changes.
- Production build needs to be a static website that can be hosted on GitHub Pages.
- CI/CD pipeline needs to run tests, lint, and deploy to GitHub Pages on push to main branch.
</Goals>

<WhatToAdd>

Add the following high level details into .github/copilot-instructions.md about the codebase to reduce the amount of searching the agent has to do to understand the codebase each time:
<HighLevelDetails>

- This repository builds a static website using Typescript that allows users to control their Boss RC-10r Rythm Loop Station from their web browser.
- The app is a 'single page app' written in Typescript and uses React and Redux for the UI.
- The app uses Vite as the build tool and bundler.
- The app uses Tailwind CSS for styling.
- The app uses the Web MIDI API to communicate with the Boss RC-10r Rythm Loop Station.
- The app only supports modern web browsers that support the Web MIDI API.
- The app is open source and available on GitHub.
- The app is licensed under the MIT License.
- The app is intended for use by musicians and audio engineers who want to control their Boss RC 
</HighLevelDetails>


<ProjectLayout>

- A description of the major architectural elements of the project, including the relative paths to the main project files, the location
of configuration files for linting, compilation, testing, and preferences.
- A description of the checks run prior to check in, including any GitHub workflows, continuous integration builds, or other validation pipelines.
- Document the steps so that the agent can replicate these itself.
- Any explicit validation steps that the agent can consider to have further confidence in its changes.
- Dependencies that aren't obvious from the layout or file structure.
- Finally, fill in any remaining space with detailed lists of the following, in order of priority: the list of files in the repo root, the
contents of the README, the contents of any key source files, the list of files in the next level down of directories, giving priority to the more structurally important and snippets of code from key source files, such as the one containing the main method.
</ProjectLayout>
</WhatToAdd>

<StepsToFollow>
- Write the .github/copilot-instructions.md file in markdown format.
   - Prompt me after this is done to review and edit it.
- Write the .github/prompts/generate.prompt.md file in markdown format.
   - This file should contain the full prompt that you would give to the coding agent to generate this repository from scratch, including the .github/copilot-instructions.md file.
   - The prompt should include the contents of the .github/copilot-instructions.md file as part of the prompt.
   - The prompt should also include any additional information that you think would be helpful for the agent to know when generating the repository.
   - Prompt me after this is done to review and edit it.
- Run .github/prompts/init.prompt.md to generate the repository.
   - This should build the repository codebase from scratch, and update the .github/copilot-instructions.md file.
   - Prompt me after this is done to manually review and test the generated repository.
      - If there are any errors getting the repository to build, test, validate, or demo, document the errors and the steps taken to work-around them.
- Review the generated repository and make any necessary edits to the .github/copilot-instructions.md file to ensure that it is accurate and complete.
- Audit the codebase for any missing dev tooling that would help developers and the agent to build, test, validate, and demo changes.
- Audit the codebase dependencies for security vulnerabilities and out-of-date packages.
- Perform a comprehensive inventory of the codebase
- Add/Update README.md to ensure it is accurate and complete.
</StepsToFollow>
   