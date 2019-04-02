workflow "Run tests and linter" {
  resolves = ["GitHub Action for Docker"]
  on = "push"
}

action "GitHub Action for Docker" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
}
