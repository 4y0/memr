## Command memorizer?

```
npm install -g memr
```

### Memorize command
```
memr --add "git add --all && git commit -am {optional_placeholder}" basic-commit
```


### Recall and run memorized command
```
memr basic-commit "Init memr repository" //Run command in the CLI and echo result
```


### Recall command but don't run
```
memr basic-commit "Init memr repository" --noexec //Just echo command on the CLI:
git add --all && git commit -am "Init memr repository"
```


### List memorized commands
```
memr --list
```


### Clear list of memorized commands
```
memr --clear
```