# 项目开发与部署规范

## 1. 页面与内容修改的闭环发布流程
- **自动提交与推送准则**:
  当对本博客的页面（`source/` 下的文章、工具页面、自定义独立看板等）、模板或样式进行新增、编辑或脱敏修复并完成本地构建校验（如 `npx hexo g`）后，**必须主动执行 Git 提交并推送到 GitHub 远程仓库**，以触发 GitHub Actions 自动化部署流水线（`.github/workflows/deploy.yml`）。
- **执行步骤与标准**:
  1. **精准暂存**: 使用 `git add` 仅暂存本次变更相关的目标文件，严禁盲目使用 `git add .` 暂存未追踪的草稿（如未定稿 Markdown）或编辑器缓存文件（如 `.copilot/`、`.obsidian/`）。
  2. **规范提交信息**: 遵循 Angular/Conventional Commits 规范（如 `feat(futures-strategy): ...`、`fix(strategy): ...`、`docs: ...`）。
  3. **拉取与推送**: 针对远程可能存在定时自动化工作流（如天气/套利数据同步）的情况，若推送遇到非快进拒绝，执行 `git stash` -> `git pull --rebase origin main` -> `git stash pop` -> `git push origin main` 确保顺利推送。
  4. **汇报结果**: 向用户反馈推送成功状态、对应的 Commit Hash 以及自动触发的 GitHub Actions 部署进度。
