import matplotlib.pyplot as plt
import numpy as np

# Generación de los valores de theta
theta = np.linspace(-20 * np.pi, 20 * np.pi, 1000)

# Ecuación en coordenadas polares
r = theta**3 + theta + 7

# Conversión a coordenadas cartesianas
x = r * np.cos(theta)
y = r * np.sin(theta)

# Configuración del gráfico
plt.figure(figsize=(10,10))
plt.plot(x, y)
plt.xlim(-1, 1)
plt.ylim(-1, 1)
plt.gca().set_aspect('equal')
plt.grid(True)
plt.title("r = θ³ + θ + 7 en escala ampliada a ±10000")
plt.show()
