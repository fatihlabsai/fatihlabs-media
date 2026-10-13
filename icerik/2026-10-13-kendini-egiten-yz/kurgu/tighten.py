import json, subprocess
w = json.load(open("words.json"))
MAXGAP, KEEP = 0.55, 0.45
segs = []; start = 0.0
for a, b in zip(w, w[1:]):
    if b[1] - a[2] > MAXGAP:
        segs.append((start, a[2] + KEEP/2)); start = b[1] - KEEP/2
segs.append((start, w[-1][2] + 0.6))
# remap word times
def remap(t):
    out = 0.0
    for s, e in segs:
        if t <= e: return out + max(0, t - s)
        out += e - s
    return out
nw = [[x[0], remap(x[1]), remap(x[2])] for x in w]
json.dump(nw, open("words2.json", "w"), ensure_ascii=False)
f = "".join(f"[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={e-s-0.03:.3f}:d=0.03[a{i}];" for i, (s, e) in enumerate(segs))
f += "".join(f"[a{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[out]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "voice.mp3", "-filter_complex", f, "-map", "[out]", "-ar", "44100", "voice2.wav"], check=True)
print(len(segs), sum(e - s for s, e in segs))
