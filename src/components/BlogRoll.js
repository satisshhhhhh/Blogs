import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";
import PreviewCompatibleImage from "./PreviewCompatibleImage";
import "bootstrap/dist/css/bootstrap.min.css";

import { CardTitle, Row, Col } from "reactstrap";

class BlogRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <div style={{ display: "flex" }}>
        {posts &&
          posts.map(({ node: post }) => (
            <div
              style={{
                height: "auto",
                margin: "2%",
                backgroundColor: "white",
                boxShadow: "6px 7px 15px #666",
              }}
              key={post.id}
            >
              <div>
                {post.frontmatter.featuredimage ? (
                  <div className="featured-thumbnail">
                    <PreviewCompatibleImage
                      imageInfo={{
                        image: post.frontmatter.featuredimage,
                        alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                      }}
                    />
                  </div>
                ) : null}
                <CardTitle style={{ padding: "15px", fontSize: "0.8rem" }}>
                  <Link
                    className="title text-primary is-size-4"
                    to={post.fields.slug}
                  >
                    {post.frontmatter.title}
                  </Link>
                  <span className="d-block pt-1">{post.frontmatter.date}</span>
                </CardTitle>
              </div>
              <p className="pl-3 pr-3 text-justify">
                {post.excerpt.charAt(0).toUpperCase() +
                  post.excerpt.substring(1, 150)}
                ...
                <br />
                <br />
                <Link
                  className="btn btn-primary text-white"
                  to={post.fields.slug}
                >
                  Keep Reading →
                </Link>
              </p>
            </div>
          ))}
      </div>
    );
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 120, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
);
