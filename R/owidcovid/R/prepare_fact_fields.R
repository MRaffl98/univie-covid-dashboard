prepare_fact_fields <- function(data, variables) {

  dataset <- data %>%
    # select location and fact variables
    select(location, all_of(variables)) %>%
    # aggregate (data is constant over time)
    group_by(location) %>%
    summarize_at(variables, function(x) x[1])

  return(dataset)

}
