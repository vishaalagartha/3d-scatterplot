import csv, random

num_points = 100
data_range = 10

with open('data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile) 
    writer.writerow(['x', 'y', 'z'])
    for i in range(1, num_points+1):
        x = random.randint(-data_range, data_range)
        y = random.randint(-data_range, data_range)
        z = random.randint(-data_range, data_range)
        writer.writerow([x, y, z])
