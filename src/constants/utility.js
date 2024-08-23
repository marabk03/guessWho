import { useQuery, gql } from '@apollo/client';

const GET_PRODUCT_COLLECTIONS = gql`
  query getProductCollection($handle: String) {
    product(handle: $handle) {
      collections(first: 3) {
        edges {
          node {
            products(first: 3) {
              edges {
                node {
                  handle
                  title
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  featuredImage {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const useProductData = ({ handle }) => {
    const { data, loading, error } = useQuery(GET_PRODUCT_COLLECTIONS, {
        variables: { handle },
    });

    if (loading) return { loading, products: [] };
    if (error) return { error, products: [] };

    const shopByCollection = data.product.collections.edges.flatMap(collectionEdge =>
      collectionEdge.node.products.edges.map(productEdge => ({
        imgSrc: productEdge.node.featuredImage.src,
        title: productEdge.node.title,
        price: productEdge.node.priceRange.minVariantPrice.amount
      }))
    );

    return { shopByCollection, loading, error };
};