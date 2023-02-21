# Urbit Developer Examples #

This repo contains the source for the following examples presented in the
[Urbit developer documentation][devdoc]:

| Example Directory | Example Desk | Interface Type |
|:------------------|:-------------|:---------------|
| chat-app          | %hut         | React (JS)     |
| groups-app        | %squad       | Sail (Hoon)    |
| journal-app       | %journal     | React (JS)     |
| voting-app        | %tally       | Sail (Hoon)    |

In the documentation that follows, the following shorthands are used:

- `/path/to/X/`: The path to directory `X` on your local machine.
- `example-directory`: The directory of an example in the source tree of this
  repository (see the table above).
- `example-desk`: The Urbit desk name of an example in this repository (see
  the table above).

## Install ##

Each developer example is hosted on `~pocwet` and available for direct install
via Urbit software distribution. To install the example on your ship, enter the
following commands into your ship's `webterm` or `dojo`:

```bash
|install ~pocwet %example-desk
|mount %example-desk
```

You can then view the files associated with this example on your machine at the
file path `/path/to/ship/example-desk`. Please note that this method **will only
install Hoon files**; to view and experiment with React front-end files, please
read on.

## Build ##

### First-time Setup ###

To build one of these example from scratch (which is essential for React
development), follow these instructions:

1. Download and extract the repo source code [from GitHub][gitsrc], e.g.
   at `/path/to/repo-source/`.
2. Follow the instructions for [creating a fake ship][fakeship], e.g.
   hosting it at `/path/to/fake-ship/`.
3. When booting up your fake ship, take note of the following line in
   the introductory digest:
   ```
   http: web interface live on http://localhost:XYZ
   ```
   The `XYZ` string on this line is port number your ship is using for its HTTP
   interface. Save this string for use in the subsequent steps.
4. In your fake ship's `dojo`, enter the following commands:
   ```
   |new-desk %example-desk
   |mount %example-desk
   ```
5. In a separate terminal session, enter the following commands:
   ```bash
   rm -rI /path/to/fake-ship/example-desk/*
   cp -RL /path/to/repo-source/example-directory/full-desk/* /path/to/fake-ship/example-desk/
   ```
6. Back in your fake ship's `dojo`, enter the following commands:
   ```
   |commit %example-desk
   |install our %example-desk
   ```
7. Again in your fake ship's `dojo`, run the following command and copy the
   result:
   ```
   +code
   ```
   This is your fake ship's password, which will be used for authentication
   from your web browser.
8. Open a web browser and navigate to the HTTP address discussed in step 3.
9. Paste the ship's password from step 7 into the form that appears and hit
   enter.
0. If the installation was successful, you should see a tile for the example
   on the home page that appears.

If the example has a React interface, further follow these instructions to
set up a locally-hosted front-end interface:

11. In a terminal session, enter the following commands (where `XYZ` is from
    step 3):
    ```bash
    cd /path/to/repo-source/example-directory/ui/
    npm install
    echo "VITE_SHIP_URL=http://127.0.0.1:XYZ" >> .env.local
    npm run dev
    ```
    The final command will generate a text digest containing a line of the form:
    ```
    > Local: http://localhost:ABC/apps/example-desk/
    ```
    The web address listed here is hosting location for your local React
    interface. Save this string for use in the subsequent steps.
12. Open a web browser and navigate to the web address from the step 11.
    If the local hosting was successful, you should see the interface for the
    example in your browser.
13. If your browser encounters an error during the previous step, then you may
    need to enable the [CORS] registry on your ship with the following `dojo`
    command (where `ABC` is from step 11):
    ```
    |cors-approve ~~http~3a.~2f.~2f.localhost~3a.ABC
    ```

### Editing and Rebuilding ###

Once the base infrastructure for an example project is in place, making changes
is very simple.

For **React front-end development**, just make sure to run `npm run dev` in a
terminal and to visit the output "local" address for testing; the page will
automatically update as you edit your React files.

For **Sail front-end development and back-end development**, the process is only
slightly more complicated:

1. If you're editing the files in-place (i.e. in
   `/path/to/fake-ship/example-desk/`), you can skip this step. If you're
   editing files from the source tree
   (i.e. in `/path/to/repo-source/example-directory/full-desk/`), you'll need
   to copy the files to your ship with the following terminal commands:
   ```bash
   rm -rI /path/to/fake-ship/example-desk/*
   cp -RL /path/to/repo-source/example-directory/full-desk/* /path/to/fake-ship/example-desk/
   ```
2. From within your fake ship's `dojo`, enter one of the following command
   sequences based on your changes:
   - If you didn't make any changes to the example app's data model:
     ```
     |commit %example-desk
     ```
   - If you did made changes to the example app's data model (e.g. `/sur` file
     changes, `state` value changes, etc.):
     ```
     |nuke %example-desk
     |commit %example-desk
     |revive %example-desk
     ```


[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[devdoc]: https://developers.urbit.org
[gitsrc]: https://github.com/urbit/docs-examples/archive/refs/heads/main.zip
[fakeship]: https://developers.urbit.org/guides/core/environment#creating-a-fake-ship
