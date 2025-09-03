const mockAiData = {
  // Main Topic
  "Machine Learning": {
    type: "topic",
    title: "Machine Learning",
    sections: [
      "Introduction to Machine Learning",
      "Supervised Learning",
      "Unsupervised Learning",
    ],
  },

  // Sections
  "Introduction to Machine Learning": {
    type: "section",
    title: "Introduction to Machine Learning",
    subsections: ["What is Machine Learning?", "History of Machine Learning"],
  },
  "Supervised Learning": {
    type: "section",
    title: "Supervised Learning",
    subsections: ["Linear Regression", "Logistic Regression"],
  },
  "Unsupervised Learning": {
    type: "section",
    title: "Unsupervised Learning",
    subsections: ["Clustering", "Dimensionality Reduction"],
  },

  // Sub-sections -> Content
  "What is Machine Learning?": {
    type: "subsection",
    title: "What is Machine Learning?",
    content: `
      <h2>What is Machine Learning?</h2>
      <p>Machine learning is a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy.</p>
      <p>It is a fundamental concept for modern data science and AI applications.</p>
    `,
  },
  "History of Machine Learning": {
    type: "subsection",
    title: "History of Machine Learning",
    content: `
      <h2>History of Machine Learning</h2>
      <p>The term machine learning was coined in 1959 by Arthur Samuel, an American IBMer and pioneer in the field of computer gaming and artificial intelligence.</p>
      <p>The field has evolved significantly since then, with major breakthroughs in the 21st century thanks to the availability of large datasets and powerful computers.</p>
    `,
  },
  "Linear Regression": {
    type: "subsection",
    title: "Linear Regression",
    content: `
      <h2>Linear Regression</h2>
      <p>Linear regression is a basic and commonly used type of predictive analysis. The overall idea of regression is to examine two things:</p>
      <ol>
        <li>Does a set of predictor variables do a good job in predicting an outcome (dependent) variable?</li>
        <li>Which variables in particular are significant predictors of the outcome variable?</li>
      </ol>
      <p>Here is a pseudo-code example of a simple linear regression model:</p>
      <pre><code>function linear_regression(features, labels):
  # Calculate mean of features and labels
  x_mean = mean(features)
  y_mean = mean(labels)

  # Calculate slope (m) and intercept (c)
  numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(features, labels))
  denominator = sum((x - x_mean)**2 for x in features)

  slope = numerator / denominator
  intercept = y_mean - slope * x_mean

  return (slope, intercept)</code></pre>
    `,
  },
  "Logistic Regression": {
    type: "subsection",
    title: "Logistic Regression",
    content: `
        <h2>Logistic Regression</h2>
        <p>Logistic regression is used for classification problems, where the output is a categorical variable (e.g., true/false, yes/no).</p>
    `,
  },
  "Clustering": {
    type: "subsection",
    title: "Clustering",
    content: `
        <h2>Clustering</h2>
        <p>Clustering is a task of grouping a set of objects in such a way that objects in the same group (called a cluster) are more similar to each other than to those in other groups.</p>
    `,
  },
  "Dimensionality Reduction": {
    type: "subsection",
    title: "Dimensionality Reduction",
    content: `
        <h2>Dimensionality Reduction</h2>
        <p>Dimensionality reduction is the process of reducing the number of random variables under consideration by obtaining a set of principal variables.</p>
    `,
  },
};
