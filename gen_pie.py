import math

def polar_to_cartesian(cx, cy, radius, angle_in_degrees):
    angle_in_radians = (angle_in_degrees - 90) * math.pi / 180.0
    return {
        'x': cx + (radius * math.cos(angle_in_radians)),
        'y': cy + (radius * math.sin(angle_in_radians))
    }

def describe_arc(x, y, radius, start_angle, end_angle):
    start = polar_to_cartesian(x, y, radius, end_angle)
    end = polar_to_cartesian(x, y, radius, start_angle)
    large_arc_flag = "0" if end_angle - start_angle <= 180 else "1"
    
    d = [
        "M", start['x'], start['y'],
        "A", radius, radius, 0, large_arc_flag, 0, end['x'], end['y'],
        "L", x, y,
        "Z"
    ]
    return " ".join(map(str, d))

slices = [
    {"percent": 65, "color": "#ff7712"}, # Orange (Thu...)
    {"percent": 21, "color": "#a40bf4"}, # Purple (Thực hiện CS BHXH)
    {"percent": 12, "color": "#d8001f"}, # Red (Cấp sổ...)
    {"percent": 1, "color": "#00ffbc"}, # Cyan (Chi trả...)
    {"percent": 1, "color": "#1569ff"}, # Blue (Thực hiện CS BHYT)
]

svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n'
# Draw a background circle so no gaps are empty
svg += '<circle cx="50" cy="50" r="48" fill="#ffffff"/>\n'

current_angle = 0
for s in slices:
    angle = s['percent'] * 360 / 100
    path = describe_arc(50, 50, 48, current_angle, current_angle + angle)
    svg += f'  <path d="{path}" fill="{s["color"]}" stroke="#ffffff" stroke-width="0.5" stroke-linejoin="round"/>\n'
    current_angle += angle

svg += '</svg>'

with open('d:/kekhaibaohiem/public/assets/images/pie_chart.svg', 'w', encoding='utf-8') as f:
    f.write(svg)

print("SVG created successfully!")
