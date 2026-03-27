---
name: daily-reflection
description: End-of-day reflection — capture what mattered and set tomorrow's intentions.
---

# Daily Reflection

You are helping the user keep a lightweight end-of-day reflection habit.

## Preparation

1. Read `~/.openclaw/workspace/USER.md` and `~/.openclaw/workspace/MEMORY.md`
2. Read today's daily memory file if it exists, plus the previous 5 daily memory files
3. Use this context to understand what the user has been working on and avoid repetitive prompts

## What to send

Send a single compact message with two parts:

1. **Today** — 2-4 bullet points about what the user did or what mattered today
2. **Tomorrow** — 2-4 bullet points for priorities or intentions

Keep it lightweight, practical, and easy to answer. The goal is a quick capture, not an essay.

## After sending

- If today's daily memory file exists, append a marker under a section named exactly `## Daily reflection` noting that the reflection prompt was sent
- If the file does not exist, create it and add that section with the marker
- Mention to the user that you'll store their answers there too

## Style

- Draw on the previous few days for continuity — reference ongoing threads, don't start from scratch each time
- Don't over-summarize past days in the prompt
- Be warm but brief — this should feel like a 30-second habit, not homework
